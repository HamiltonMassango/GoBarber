import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { formatPrice } from '../../util/format';
import * as cartAtions from '../../store/modules/cart/actions';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
} from 'react-icons/md';

import { Container, ProductTable, Total } from './styles';
import tenis from '../../assets/images/ok.jpg';

class Cart extends Component {
  updateAmountRequest = this.props.updateAmountRequest;
  increment(product) {
    this.updateAmountRequest(product.id, product.amount - 1);
  }
  decrement(product) {
    this.updateAmountRequest(product.id, product.amount + 1);
  }
  render() {
    const { cart, removeFromCart, total } = this.props;
    return (
      <Container>
        <ProductTable>
          <thead>
            <tr>
              <th />
              <th>PRODUTO</th>
              <th>QTD</th>
              <th>SUBTOTAL</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {cart.map(product => (
              <tr key={product.id}>
                <td>
                  <img src={tenis} alt="Tenis" />
                </td>
                <td>
                  <strong>{product.title}</strong>
                  <span>{product.priceFormatted}</span>
                </td>
                <td>
                  <div>
                    <button
                      type="button"
                      onClick={() => this.increment(product)}
                    >
                      <MdRemoveCircleOutline size={20} color="#7159c1" />
                    </button>
                    <input type="numeber" readOnly value={product.amount} />
                    <button
                      type="button"
                      onClick={() => this.decrement(product)}
                    >
                      <MdAddCircleOutline size={20} color="#7159c1" />
                    </button>
                  </div>
                </td>
                <td>
                  <strong>{product.subTotalForm}</strong>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => {
                      removeFromCart(product.id);
                    }}
                  >
                    <MdDelete size={20} color="#7159c1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </ProductTable>
        <footer>
          <button type="button">Finalizar pedido </button>
          <Total>
            <span>Total</span>
            <strong>{total}</strong>
          </Total>
        </footer>
      </Container>
    );
  }
}
const mapStateToProp = dispatch => bindActionCreators(cartAtions, dispatch);

const mapStateToProps = state => ({
  cart: state.cart.map(product => ({
    ...product,
    subTotalForm: formatPrice(product.price * product.amount),
  })),
  total: formatPrice(
    state.cart.reduce((total, product) => {
      return total + product.price * product.amount;
    }, 0),
  ),
});
export default connect(mapStateToProps, mapStateToProp)(Cart);
