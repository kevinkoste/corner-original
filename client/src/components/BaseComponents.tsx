import styled from 'styled-components'
import TextareaAutosize from 'react-textarea-autosize'


// minimal Div component
type GridMapType = { [index: number]: string }
export const GridMap: GridMapType = {
  1: '8.33%',
  2: '16.66%',
  3: '25%',
  4: '33.33%',
  5: '41.66%',
  6: '50%',
  7: '58.33%',
  8: '66.66%',
  9: '75%',
  10: '83.33%',
  11: '91.66%',
  12: '100%'
}
type DivProps = {
  column?: boolean,
  row?: boolean,
  width: number,
}
export const Div = styled.div<DivProps>`
  display: flex;
  flex-direction: ${props => props.column ? 'column' : props.row ? 'row' : 'column'};
  width: ${props => GridMap[props.width]};
`

// text defaults
export const H1 = styled.h1`
  font-family: 'source-serif';
  font-size: 30px;
	text-align: left;
  font-weight: unset;

  margin: unset;
  padding: 0px;
`
export const H2 = styled.h2`
  font-family: 'inter';
  font-size: 16px;
  line-height: 24px;

	text-align: left;
  font-weight: unset;

  margin: unset;
  padding: 0px;
`

// default image using background-image
type ImageProps = {
  src: string
  size: number,
}
export const Img = styled.div<ImageProps>`
  background-image: ${props => `url(${process.env.REACT_APP_S3_BUCKET + props.src})`};
  background-position: center;
  background-size: cover;
  position: relative;
  text-align: center;
  padding-bottom: ${props => GridMap[props.size]};
`

// resizeable textarea using external lib
export const TextArea = styled(TextareaAutosize)`
	outline: none;
	box-shadow: none;
	border: none;
	overflow: hidden;
	resize: none;
	padding: 0px;
  text-align: left;
  
  font-family: 'source-serif';
  font-size: 30px;
`

export const Button = styled.button`
  /* removing default button styles */
  display: inline-block;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  text-decoration: none;

  font-family: 'inter';
  font-size: 16px;

  background-color: black;
  color: white;
  padding: 10px 20px 12px 20px;
  cursor: pointer;
  border-radius: 30px;
`


// type ImageProps = {
//   src: string
// }
// export const Icon = styled.img<ImageProps>`
//   src: ${props => pros.src};
//   background-position: center;
//   background-size: cover;
//   position: relative;
//   text-align: center;
//   padding-bottom: ${props => GridMap[props.size]};
// `