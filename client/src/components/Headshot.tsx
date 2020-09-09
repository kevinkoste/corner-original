import React, { useState } from 'react'
import styled from 'styled-components'
import imageCompression from 'browser-image-compression'
import ClipLoader from "react-spinners/ClipLoader"

// presentation/types
import { useDetectMobile } from '../libs/hooksLib'
import { Img } from '../components/Base'
import { HeadshotComponent } from '../models/Profile'

// logic
import { useProfileContext, updateComponent } from '../context/ProfileContext'
import { PostProtectProfileImage } from '../libs/apiLib'

export const EditHeadshot: React.FC<HeadshotComponent> = ({ id, props }) => {

	const mobile: boolean = useDetectMobile()

  const { profileState, profileDispatch } = useProfileContext()

	const [ uploading, setUploading ] = useState(false)

	const handleFileUpload = async (event: any) => {
		setUploading(true)

		const imageFile = event.target.files[0]
		const compressedFile = await imageCompression(imageFile, {
			maxSizeMB: 0.3,
			useWebWorker: true
		})

		const formData = new FormData()
		formData.append('file', compressedFile)

		const res = await PostProtectProfileImage(profileState.profile.username, formData)
		const uploadedImage = res.data.image

		profileDispatch(updateComponent({
			id: id,
			type: 'headshot',
			props: {
				image: uploadedImage
			}
		}))

		setUploading(false)
	}
	
	return (
		<ProfileImage size={mobile? 12 : 10} src={props.image}>

			{ (profileState.editing) &&
				<ProfileImageUploadTopWrapper>
						{	uploading &&
							<ClipLoader
								css={'position: relative; left: -50%; text-align: center;'}
								loading={uploading}
								color={'#000000'}
							/>
						}
						{ !uploading &&
							<ProfileImageUploadWrapper>
								Choose Photo
								<ProfileImageUploadInput
									type='file'
									onChange={handleFileUpload}
								/>
							</ProfileImageUploadWrapper>
						}
				</ProfileImageUploadTopWrapper>
			}

		</ProfileImage>
	)
}

// public profile version
export const Headshot: React.FC<HeadshotComponent> = ({ id, props }) => {
	const mobile: boolean = useDetectMobile()
	return (
			<ProfileImage size={mobile ? 12 : 10} style={{marginTop:''}} src={props.image} />
	)
}


const ProfileImage = styled(Img)`
	margin-top: 20px;
` 

const ProfileImageUploadInput = styled.input`
	display: none;
	width: unset;
`

const ProfileImageUploadTopWrapper = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
  transform: translate(0,-50%);
`

const ProfileImageUploadWrapper = styled.label`
	position: relative;
	left: -50%;
	text-align: center;
	width: unset;

	border: none;
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

