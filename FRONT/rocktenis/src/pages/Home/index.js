import React, { Component } from 'react';
import { connect } from 'react-redux';

import { ProductList } from './styles';
import { MdAddShoppingCart } from 'react-icons/md';
import tenis from '../../assets/images/ok.jpg';
import api from '../../services/api';
import { formatPrice } from '../../util/format';
import * as cartAtions from '../../store/modules/cart/actions';

class Home extends Component {
  state = {
    products: [],
  };

  async componentDidMount() {
    const response = await api.get('products');
    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));
    this.setState({ products: data });
  }
  handleAddProduct = product => {
    const { dispatch } = this.props;
    dispatch(cartAtions.addToCart(product));
  };
  render() {
    const { products } = this.state;

    return (
      <ProductList>
        {products.map(product => (
          <li key={product.id}>
            <img src={tenis} alt="" />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>
            <button
              type="button"
              onClick={() => this.handleAddProduct(product)}
            >
              <div>
                <MdAddShoppingCart size={16} color="#FFF" /> 3
              </div>
              <span> ADICIONAR AO CARRINHO </span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

export default connect()(Home);
