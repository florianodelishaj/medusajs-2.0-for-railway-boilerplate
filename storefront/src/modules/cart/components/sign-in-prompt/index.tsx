import { Button } from "@components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold">
          Hai già un account?
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Accedi per un&apos;esperienza migliore.
        </p>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button
            variant="elevated"
            className="hover:bg-green-400"
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
