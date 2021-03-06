import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Form, SubmitButton, List, Filters } from './style';
import Container  from '../../components/Container/index';

import api from '../services/api';

export default class Main extends Component {
	state = {
		newRepo: '',
		repositories: [],
		loading: false,
		error : false,
	};

	// Carregar os dados do repositorios
	componentDidMount() {
		const repositories = localStorage.getItem('repositories');
		if (repositories) {
			this.setState({ repositories: JSON.parse(repositories) });
		}
	}

	// Salvar os dados do localStore vamos usar o componente
	componentDidUpdate(_, prevState) {
		const { repositories } = this.state;
		if (prevState.repositories !== repositories) {
			localStorage.setItem('repositories', JSON.stringify(repositories));
		}
	}

	handleInputChange = e => {
		this.setState({ newRepo: e.target.value });
	};

	ValidRpository = () => {
		const { repositories, newRepo } = this.state;
		return !repositories.find(repository => repository === newRepo)[0];
	} 
	handleSubmit = async e => {
		try {
			e.preventDefault();

			this.setState({ loading: true });
			const { newRepo, repositories } = this.state;
			if(!newRepo) {
				this.setState({ loading : false});
				throw new Error('Digite qual quer coisa');
			}
			if(this.ValidRpository()){
				throw new Error('Repository repositorio ');
			}
		;
			const response = await api.get(`/repos/${newRepo}`);
		
			const data = {
				name: response.data.full_name,
			};
			
			this.setState({
				repositories: [...repositories, data],
				newRepo: '',
				loading: false,
			});
		} catch (error) {
			this.setState({
				error : true
			});
		}
	
	};
	handleFilterAll(){
		alert('Olá mundo ');
	}
	handleFilterClose(){
		alert('Fechados');
	}
	handleFilterOpen(){
		alert('Abertos ');
	}
	render() {
		let { newRepo, loading, repositories, error } = this.state;
		return (
			<Container>
				<h1>
					<FaGithubAlt />
					Repositórios
				</h1>
				<Filters>
					<strong onClick={this.handleFilterAll} >All</strong>
					<strong onClick={this.handleFilterClose}>Close</strong>
					<strong onClick={this.handleFilterOpen}>Open</strong>
				</Filters>
				<Form onSubmit={this.handleSubmit}  error={error}>
					<input
						type="text"
						placeholder="Adicionar repositório"
						valeu={newRepo}
						onChange={this.handleInputChange}
					/>
					<SubmitButton loadings={loading}>
						{loading ? (
							<FaSpinner color="#fff" size={14} />
						) : (
							<FaPlus color="#fff" size={14} />
						)}
					</SubmitButton>
				</Form>
				<List>
					{repositories.map(repository => (
						<li key={repository.name}>
							<span>{repository.name}</span>
							<Link to={`/repository/${encodeURIComponent(repository.name)}`}>
								Detalhes
							</Link>
						</li>
					))}
				</List>
			</Container>
		);
	}
}
