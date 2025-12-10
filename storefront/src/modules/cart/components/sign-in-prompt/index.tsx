import { Button } from "@components/ui/button"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          Hai già un account?
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          Accedi per un&apos;esperienza migliore.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="elevated"
            className="hover:bg-pink-400"
            data-testid="sign-in-button"
          >
            Accedi
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
