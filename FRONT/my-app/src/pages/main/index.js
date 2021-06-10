import React, { Component } from "react";
import { Container, Form, SubmitButton } from "./style";
import { FaGithubAlt, FaPlus } from "react-icons/fa";

import api from '../services/api';


export default class Main extends Component {
  state = { 
    newRepo: '',
    repositories : [],
    loading: false
  }
 
  handleInputChange = e => {
    this.setState({ newRepo : e.target.value }); 
  }

  handleSubmit = e => {
    e.preventDefault();
    
    this.setState({ loading : true });

    const{ newRepo, repositories } = this.state;
    const response = api.get(`/repos/${newRepo}`);
    const data = {
      name : response.data.full_name,
    }

    this.setState({ 
      repositories : [...repositories, data],
      newRepo : '',
      loading: false
    });
  }

  render () {
    let { newRepo , loading} = this.state;
    return(
      <Container>  
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit = {this.handleSubmit}>
          <input 
            type="text"
            placeholder="Adicionar repositório" 
            valeu = {newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading = {loading}>
            <FaPlus color="#fff" size= {14}/>
          </SubmitButton>
        </Form>   
      </Container>
    );
  }
 }