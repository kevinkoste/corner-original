import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import ExitIcon from '../icons/delete.svg'

// presentation/types
import { useDetectMobile } from '../libs/hooksLib'
import { Div, H1, H2, Img, ExternalImg, TextArea, Button, Input, InlineInput } from '../components/BaseComponents'
import { Book, BookshelfComponent } from '../models/Profile'

// logic
import { GetBookData } from '../libs/bookLib'
import { useProfileContext, setEditing, updateComponent, deleteBookById } from '../context/ProfileContext'


export const Bookshelf: React.FC<BookshelfComponent> = ({ id, props }) => {

  const { profileState, profileDispatch } = useProfileContext()
  
	const placeholder = [
		{
      id: '1',
      title: 'The Dream Machine',
      author: 'J.C.R. Licklider',
      date: '2002',
      link: 'http://books.google.com/books?id=7HpQAAAAMAAJ&dq=thedreammachine&hl=&source=gbs_api',
      image: 'http://books.google.com/books/content?id=7HpQAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
		},
		{
      id: '2',
      title: 'The Dream Machine',
      author: 'J.C.R. Licklider',
      date: '2002',
      link: 'http://books.google.com/books?id=7HpQAAAAMAAJ&dq=thedreammachine&hl=&source=gbs_api',
      image: 'http://books.google.com/books/content?id=7HpQAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api'
		}
	]

	const onAddClick = () => {
		profileDispatch(setEditing(true))
	}


	if (!profileState.editing && profileState.profile.components.find(comp => comp.type === 'bookshelf')?.props.books.length === 0) {
		return (
			<ComponentContainer column width={12}>

				<H1 style={{color: 'lightgray'}}>
          Bookshelf
				</H1>

				<Div column width={12} style={{position: 'relative'}}>
					{ placeholder.map((book, idx) => 
						<BookRow
							color={'lightgray'}
							key={idx}
							book={book}
						/>
					)}
					<AddButton onClick={onAddClick}>
						Add books
					</AddButton>
				</Div>

			</ComponentContainer>
		)
  }
  else if (profileState.editing) {
		return (
			<ComponentContainer column width={12}>
				<H1>
          Bookshelf
				</H1>

				{ profileState.profile.components.find(comp => comp.type === 'bookshelf')?.props.books.map((book: any, idx: number) => 
					<BookEditRow
						key={idx}
						book={book}
					/>
				)}

        <BookAddRow
          id={id}
        />

			</ComponentContainer>
		)
	} else {
		return (
			<ComponentContainer column width={12}>
				<H1>
					Bookshelf
				</H1>

        { profileState.profile.components.find(comp => comp.type === 'bookshelf')?.props.books.map((book: any, idx: number) => 
					<BookRow
						key={idx}
						book={book}
					/>
				)}

			</ComponentContainer>
		)
	}
}


// pure presentation component for Book
type BookRowProps = { book: any, color?: string }
const BookRow: React.FC<BookRowProps> = ({ book, color }) => {

  const { title, author, date, link, image } = book

	return (
		<Div row width={12} style={{ alignItems:'top', marginTop:'15px', marginBottom:'15px' }}>
			<LogoWrapper style={{position: 'relative'}}>
			<ExternalImg
				src={image}
				style={{ minWidth:'51px', minHeight:'60px', backgroundSize:'contain' }}
			/>
			</LogoWrapper>

			<ExperienceText column width={12} style={{color: color||'black' }}>
				<H2>
					{title}
				</H2>
				<H2>
					{author}
				</H2>
				<H2>
					{date}
				</H2>
			</ExperienceText>

		</Div>
	)
}

// similar to presentation but with delete button
type BookEditRowProps = { book: any, color?: string }
const BookEditRow: React.FC<BookRowProps> = ({ book, color }) => {

  const { profileState, profileDispatch } = useProfileContext()

  const { id, title, author, date, link, image } = book

  const handleDeleteBook = () => {
		profileDispatch(deleteBookById(id))
	}
  

	return (
		<Div row width={12} style={{ alignItems:'top', marginTop:'15px', marginBottom:'15px' }}>
			<LogoWrapper style={{position: 'relative'}}>
        <ExternalImg
          src={image}
          style={{ minWidth:'60px', minHeight:'60px', backgroundSize:'contain' }}
        />
        <DeleteIcon 
          src={ExitIcon}
          onClick={handleDeleteBook}
        />
			</LogoWrapper>

			<ExperienceText column width={12} style={{color: color||'black' }}>
				<H2>
					{title}
				</H2>
				<H2>
					{author}
				</H2>
				<H2>
					{date}
				</H2>
			</ExperienceText>

		</Div>
	)
}


// book add form, needs the id to update the component in onClick
type BookAddRowProps = { id: string }
const BookAddRow: React.FC<BookAddRowProps> = ({ id }) => {
  
  const { profileState, profileDispatch } = useProfileContext()

  const [ bookInput, setBookInput ] = useState<string>('')
  const [ bookData, setBookData ] = useState<Book>({
    id: '',
    title: '',
    author: '',
    date: '',
    link: '',
    image: ''
  })

  // checks availability on a timeout
	useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
			if (bookInput !== '') {

				GetBookData(bookInput)
				.then(res => {

          const book = res.data.items[0]

          setBookData({
            id: uuidv4().toString(),
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors[0],
            date: book.volumeInfo.publishedDate.substring(0,4),
            link: book.volumeInfo.infoLink,
            image: book.volumeInfo.imageLinks.thumbnail
          })

				})
				.catch(err => console.log(err))
			}
		}, 200)
		return () => clearTimeout(delayDebounceFn)
		// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookInput])


	const onClick = () => {
		profileDispatch(updateComponent({
			id: id,
			type: 'bookshelf',
			props: { books: [...profileState.profile.components.find(comp => comp.type === 'bookshelf')?.props.books, bookData] }
		}))
	}

  return (
    <Div row width={12} style={{ alignItems:'top', marginTop:'15px' }}>

      <Div column width={12}>
        <H2>
          Enter the title of a book
        </H2>
        <Div width={12} style={{ position:'relative' }}>
          <BookInput
            placeholder={'lEaN IN'}
            onChange={(event: any) => setBookInput(event.target.value)}
            value={bookInput}
            style={{borderBottom: 'none', height: 'auto', marginLeft: '0px'}}
          />
          <DomainButton onClick={onClick}>
            Add Book &#62;
          </DomainButton>
        </Div>
      </Div>

    </Div>
  )
}


const BookInput = styled(InlineInput)`
	border-bottom: 1px solid black;
	height: 20px;
	margin-right: 5px;
	margin-left: 5px;
`

const ExperienceText = styled(Div)`
	display: inline-block;
	margin-left: 15px;
`

const LogoWrapper = styled(Div)`
	margin-left: 15px;
	@media (max-width: 768px) {
		margin-left: 0px;
	}
`

const DeleteIcon = styled.img`
	position: absolute;
	background-size: 50%;
	left:0;
	z-index: 2;
	height: 51px;
	width: 51px;
`

const DomainButton = styled(Button)`
	background-color: white;
	color: black;
	font-size: 16px;
	font-family: 'inter';
  line-height: 24px;
	padding: 0;
	@media (max-width: 768px) {
		position: absolute;
		right: 0;
	}
`

const ComponentContainer = styled(Div)`
	margin-top: 20px;
	@media (max-width: 768px) {
		margin-top: 20px;
	}
`

const AddButton = styled(Button)`
	position: absolute;
	top: 50%;
	left: 50%;
  transform: translate(-50%,-50%);
`

