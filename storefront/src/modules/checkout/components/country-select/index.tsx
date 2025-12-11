import { Listbox, Transition } from "@headlessui/react"
import { Fragment, useMemo, useState, useEffect } from "react"
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

  useEffect(() => {
    if (value) {
      setSelectedCountry(value)
    }
  }, [value])

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
        const translatedName = countries.getName(
          country.iso_2!.toUpperCase(),
          locale
        )
        return {
          value: country.iso_2!,
          label: translatedName || country.display_name,
        }
      })
  }, [region, locale])

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
    <div className="flex flex-col w-full">
      {/* Hidden input per inviare il valore nel form */}
      <input
        type="hidden"
        name={name}
        value={selectedCountry}
        autoComplete={props.autoComplete}
      />
      <Listbox onChange={handleSelect} value={selectedCountry}>
        {({ open }) => (
          <div className="relative z-0">
            <Listbox.Button
              className="relative w-full flex justify-between items-center pt-4 pb-1 px-4 h-12 text-left bg-white cursor-pointer focus:outline-none border border-black rounded-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-400 transition-all font-medium"
              data-testid={props["data-testid"]}
            >
              <span className="block truncate text-sm opacity-0">
                {selectedOption?.label || " "}
              </span>
            </Listbox.Button>
            <label
              htmlFor={name}
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
              <Listbox.Options className="absolute z-20 w-full mt-1 overflow-auto bg-white border border-black rounded-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-60 focus:outline-none">
                {countryOptions?.map((country) => {
                  const isSelected = selectedCountry === country.value
                  return (
                    <Listbox.Option
                      key={country.value}
                      value={country.value}
                      className="cursor-pointer select-none relative px-4 py-2 hover:bg-pink-400 transition-colors flex items-center gap-x-3"
                    >
                      <div className="flex-shrink-0 w-4">
                        {isSelected && (
                          <Check className="h-4 w-4" strokeWidth={3} />
                        )}
                      </div>
                      <span className="text-sm">{country.label}</span>
                    </Listbox.Option>
                  )
                })}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  )
}

CountrySelect.displayName = "CountrySelect"

export default CountrySelect
