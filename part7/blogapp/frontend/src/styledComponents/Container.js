import styled from 'styled-components'

export const Container = styled.div`
  display: ${({ display }) => `${display}` || 'block'};
  width: ${({ width }) => `${width}px` || '100%'};
  margin: ${({ margin }) => `${margin}` || 0};
  padding: ${({ padding }) => `${padding}` || 0};
  border: ${({ border }) => `${border}` || 0};

  width: ${({ width }) => `${width}px` || '100%'};
  background: ${({ background }) => `${background}` || 'none'};
  flex-direction: ${({ flexDirection }) => `${flexDirection}` || 'row'};
  justify-content: ${({ justifyContent }) => `${justifyContent}` || 'left'};
`
