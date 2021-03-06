import styled, { css, keyframes } from 'styled-components';

export const Form = styled.form`
	margin-top: 30px;
	display: flex;
	flex-direction: row;
	input {
		flex: 1;
		border: 1px solid #eee;
		padding: 10px 15px;
		border-radius: 4px;
		font-size: 16px;
		${props =>
		props.error &&
			`border: 1px solid red;`
		}
	}
`;

const rotate = keyframes`
  form {
    transform : rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const SubmitButton = styled.button.attrs(props => ({
	type: 'submit',
	disabled: props.loadings,
}))`
	background: #7159c1;
	border: 0;
	padding: 0 15px;
	margin-left: 10px;
	border-radius: 4px;

	display: flex;
	justify-content: center;
	align-items: center;

	&[disabled] {
		cursor: not-allowed;
		opacity: 0.6;
	}
	${props =>
		props.loadings &&
		css`
			svg {
				animation: ${rotate} 2s linear infinite;
			}
		`}
`;

export const List = styled.ul`
	list-style: none;
	margin-top: 30px;

	li {
		padding: 15px 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		& + li {
			border-top: 1px solid #eee;
		}
		a {
			color: #7159c1;
			text-decoration: none;
		}
	}
`;

export const Filters = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	border: 1px solid #eee;
	padding: 10px;
	margin: 5px;
	border-radius: 5px;
	width: 100%;
	strong {
		font-size: 12px;
		color: #adabab;
	}
	strong:hover {
		color : #312f2f;
		font-size: 13px;
		cursor: pointer;
	}

`;
