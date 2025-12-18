"use client"

import { useResetOnboardingState } from "@lib/hooks/use-checkout-actions"
import { Button, Container, Text } from "@medusajs/ui"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  const { resetOnboarding, isResetting } = useResetOnboardingState()

  const handleReset = async () => {
    try {
      await resetOnboarding(orderId)
    } catch (error) {
      // Error toast is already handled by useResetOnboardingState hook
    }
  }

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          Your test order was successfully created! 🎉
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          You can now complete setting up your store in the admin.
        </Text>
        <Button
          className="w-fit"
          size="xlarge"
          onClick={handleReset}
          isLoading={isResetting}
        >
          Complete setup in admin
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
