import React from 'react'

// presentation
import { useMobile } from '../libs/hooks'
import { PageContainer, BodyContainer, H1 } from '../components/Base'
import { Header } from '../components/Header'

export const NotInvitedPage: React.FC = () => {
  const mobile = useMobile()

  return (
    <PageContainer column width={12}>
      <Header title="Not Invited" />

      <BodyContainer column width={mobile ? 11 : 6}>
        <H1>
          Sorry, you have not been invited! Ask a friend on Corner for an
          invite.
        </H1>
      </BodyContainer>
    </PageContainer>
  )
}
export default NotInvitedPage
