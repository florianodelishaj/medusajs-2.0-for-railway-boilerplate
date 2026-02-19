import { Metadata } from "next"
import SearchModal from "@modules/search/templates/search-modal"

export const metadata: Metadata = {
  robots: { index: false },
}

export default function SearchModalRoute() {
  return <SearchModal />
}
