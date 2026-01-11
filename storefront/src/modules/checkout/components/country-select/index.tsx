"use client"

import { Listbox, Transition } from "@headlessui/react"
import { Fragment, useMemo, useState, useEffect, useRef, useLayoutEffect } from "react"
import { Check } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import countries from "i18n-iso-countries"
import { cn } from "@lib/util/cn"

type CountrySelectProps = {
  region?: HttpTypes.StoreRegion
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  name?: string
  label?: string
  autoComplete?: string
  required?: boolean
  "data-testid"?: string
  locale?: string // Locale da usare per le traduzioni (es. "it", "en", "fr")
}

const CountrySelect = ({
  region,
  value,
  onChange,
  name,
  label = "Paese",
  locale = "it",
  required,
  ...props
}: CountrySelectProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(value || "")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [showError, setShowError] = useState(false)
  const openStateRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedCountryRef = useRef<string>(selectedCountry)

  const searchInputCallbackRef = (node: HTMLInputElement | null) => {
    if (node && isDropdownOpen) {
      // Focus when the input is mounted and dropdown is open
      setTimeout(() => {
        node.focus()
      }, 0)
    }
  }

  // Update dropdown state via useLayoutEffect to avoid setState during render
  useLayoutEffect(() => {
    if (openStateRef.current !== isDropdownOpen) {
      if (!openStateRef.current && isDropdownOpen) {
        // Dropdown just opened - focus will be handled by callback ref
      } else if (openStateRef.current && !isDropdownOpen) {
        // Dropdown just closed - reset search
        setSearchQuery("")
      }
    }
  }, [isDropdownOpen])

  // Sync ref with state
  useEffect(() => {
    selectedCountryRef.current = selectedCountry
    if (selectedCountry) {
      setShowError(false)
    }
  }, [selectedCountry])

  useEffect(() => {
    if (value) {
      setSelectedCountry(value)
    }
  }, [value])

  // Intercept form submit and validate (only set up once)
  useEffect(() => {
    const form = containerRef.current?.closest("form")

    if (!form || !required) return

    const handleSubmit = (e: SubmitEvent) => {
      // Use ref instead of state to avoid recreating listener
      if (!selectedCountryRef.current) {
        e.preventDefault()
        e.stopPropagation()
        setShowError(true)

        // Scroll to this field
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }

    form.addEventListener("submit", handleSubmit)

    return () => {
      form.removeEventListener("submit", handleSubmit)
    }
  }, [required]) // Only depends on required, not selectedCountry

  // Registra le locali necessarie basandosi sui paesi nella region
  useEffect(() => {
    if (!region?.countries) return

    // Raccogli tutti i country codes unici dalla region
    const uniqueCountryCodes = Array.from(
      new Set(region.countries.map((c) => c.iso_2))
    )

    // Prova a registrare la locale per ciascun paese
    // (molti country codes corrispondono ai locale codes: it, fr, de, es, etc.)
    uniqueCountryCodes.forEach((countryCode) => {
      if (!countryCode) return

      try {
        if (!countries.getAlpha2Codes()[countryCode.toUpperCase()]) {
          return // Skip se il paese non è valido
        }

        // Prova a caricare la locale con lo stesso nome del country code
        const localeData = require(`i18n-iso-countries/langs/${countryCode}.json`)
        countries.registerLocale(localeData)
      } catch (e) {
        // Ignora se la locale non esiste
      }
    })

    // Assicurati che la locale richiesta per la traduzione sia registrata
    try {
      const localeData = require(`i18n-iso-countries/langs/${locale}.json`)
      countries.registerLocale(localeData)
    } catch (e) {
      console.warn(`Locale ${locale} not available, falling back to en`)
      const enLocale = require("i18n-iso-countries/langs/en.json")
      countries.registerLocale(enLocale)
    }
  }, [region, locale])

  const countryOptions = useMemo(() => {
    if (!region) {
      return []
    }

    return region.countries
      ?.filter((country) => country.iso_2) // Filtra paesi senza iso_2
      .map((country) => {
        return {
          value: country.iso_2!,
          label: country.display_name, // Use display_name from backend to avoid hydration errors
        }
      })
  }, [region])

  // Filtra le opzioni in base alla ricerca
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return countryOptions

    return countryOptions?.filter((country) =>
      country.label?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [countryOptions, searchQuery])

  const handleSelect = (countryCode: string) => {
    setSelectedCountry(countryCode)

    if (onChange && name) {
      const syntheticEvent = {
        target: {
          name,
          value: countryCode,
        },
      } as React.ChangeEvent<HTMLSelectElement>

      onChange(syntheticEvent)
    }
  }

  const selectedOption = countryOptions?.find(
    (c) => c.value === selectedCountry
  )
  const hasValue = !!selectedCountry

  return (
    <div ref={containerRef} className="flex flex-col w-full">
      {/* Hidden input per inviare il valore nel form */}
      <input
        type="hidden"
        name={name}
        id={name}
        value={selectedCountry}
        autoComplete={props.autoComplete}
      />
      <Listbox onChange={handleSelect} value={selectedCountry}>
        {({ open }) => {
          // Update ref immediately (doesn't cause re-render)
          openStateRef.current = open

          // Schedule state update for next render cycle
          if (open !== isDropdownOpen) {
            Promise.resolve().then(() => setIsDropdownOpen(open))
          }

          return (
            <div className="relative z-50">
              <Listbox.Button
                className={cn(
                  "relative w-full flex justify-between items-center pt-4 pb-1 px-4 h-12 text-left bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-400 transition-all font-medium border",
                  showError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-black focus:ring-green-400"
                )}
                data-testid={props["data-testid"]}
              >
              <span className="block truncate text-sm opacity-0">
                {selectedOption?.label || " "}
              </span>
            </Listbox.Button>
            <label
              className={cn(
                "flex items-center justify-center mx-3 px-1 transition-all absolute duration-300 origin-0 text-black font-medium pointer-events-none",
                open || hasValue
                  ? "top-1.5 text-[10px] -translate-y-0"
                  : "top-3.5 text-sm"
              )}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="absolute inset-0 flex items-end pb-2 px-4 pointer-events-none">
              <span
                className={cn(
                  "block truncate text-sm font-medium transition-opacity",
                  open || hasValue ? "opacity-100" : "opacity-0"
                )}
              >
                {selectedOption?.label || ""}
              </span>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-50 w-full mt-1 bg-white border border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-60 focus:outline-none overflow-hidden">
                {/* Search input */}
                <div className="sticky top-0 bg-white border-b border-gray-300 p-2">
                  <input
                    ref={searchInputCallbackRef}
                    type="text"
                    id={`${name}-search`}
                    name={`${name}-search`}
                    autoComplete="off"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                    placeholder="Cerca paese..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {/* Options list */}
                <div className="overflow-auto max-h-48">
                  {filteredOptions && filteredOptions.length > 0 ? (
                    filteredOptions.map((country) => {
                      const isSelected = selectedCountry === country.value
                      return (
                        <Listbox.Option
                          key={country.value}
                          value={country.value}
                          className="cursor-pointer select-none relative px-4 py-2 hover:bg-green-400 transition-colors flex items-center gap-x-3"
                        >
                          <div className="flex-shrink-0 w-4">
                            {isSelected && (
                              <Check className="h-4 w-4" strokeWidth={3} />
                            )}
                          </div>
                          <span className="text-sm">{country.label}</span>
                        </Listbox.Option>
                      )
                    })
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500 text-center">
                      Nessun paese trovato
                    </div>
                  )}
                </div>
              </Listbox.Options>
            </Transition>
          </div>
          )
        }}
      </Listbox>
      {showError && (
        <p className="text-sm text-red-500 mt-1 font-medium">
          Seleziona un paese
        </p>
      )}
    </div>
  )
}

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
