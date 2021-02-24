import Appointment from '../models/Appointments';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';
import pt from 'date-fns/locale/pt';

import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import * as Yup from 'yup';
import Mail from '../../lib/mail';
class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const appointment = await Appointment.findAll({
      where: {
        user_id: req.userId,
        canceled_at: null,
      },
      limit: 20,
      offset: (page - 1) * 20,
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointment);
  }
  async store(req, res) {
    const shema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await shema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails ' });
    }
    const { provider_id, date } = req.body;
    /**
     * Check if provider_d is a provider
     */

    const checkIsProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with providers ' });
    }

    /**
     * Check if provider is provider for appointment
     */
    if (provider_id == req.userId) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments for yourself ' });
    }

    // Check is dates

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited ' });
    }

    // Check date availability

    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });
    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available ' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Notify appointment provider
     * **/
    const user = await User.findByPk(req.userId);
    const formatDate = format(hourStart, "dd 'de' MMMM', às' H:mm'h'", {
      locale: pt,
    });

    const valor = await Notification.create({
      content: `Novo agendamento de ${user.name} para dia ${formatDate}`,
      user: provider_id,
    });
    return res.json({ appointment, valor });
  }
  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });
    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permissios to cancel this appointment ",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);
    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'you can only cancel appointement 2 hours in advance ',
      });
    }
    appointment.canceled_at = new Date();
    await appointment.save();
    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'canceletion',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(appointment.date, "dd 'de' MMMM', às' H:mm'h'", {
          locale: pt,
        }),
      },
    });
    res.json(appointment);
  }
}

export default new AppointmentController();
