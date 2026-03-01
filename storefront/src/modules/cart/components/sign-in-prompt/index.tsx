import { Button } from "@components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-black uppercase border-l-4 border-green-400 pl-3">
          Hai già un account?
        </h2>
        <p className="text-sm text-black/50 mt-1">
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
