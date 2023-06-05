import styled from 'styled-components'

export const Container = styled.div`
  margin: auto;
  width: ${({ width }) => `${width}px` || '100%'};
`
