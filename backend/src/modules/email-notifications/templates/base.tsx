import { Html, Body, Container, Preview, Tailwind, Head } from '@react-email/components'
import * as React from 'react'

interface BaseProps {
  preview?: string
  children: React.ReactNode
}

export const Base: React.FC<BaseProps> = ({ preview, children }) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Tailwind>
        <Body className="bg-[#F4F4F0] my-auto mx-auto font-sans px-2">
          <Container className="border-2 border-solid border-black rounded-md my-[40px] mx-auto p-[30px] max-w-[600px] w-full overflow-hidden bg-white">
            <div className="max-w-full break-words">
              {children}
            </div>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
