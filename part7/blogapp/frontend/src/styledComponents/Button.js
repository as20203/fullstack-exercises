import styled from 'styled-components'

export const Button = styled.button`
  background-color: ${({ backgroundColor }) => backgroundColor || `#e7e7e7`};
  color: ${({ color }) => color || `black`};
  border: none;
  padding: ${({ padding }) => padding || `10px 32px`};
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  cursor: pointer;
`
