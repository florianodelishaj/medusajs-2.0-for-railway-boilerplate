import { useState, useEffect } from "react";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Button, Input, Label, toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../lib/sdk.js";

type DynamicField = {
  label: string;
  value: string;
};

type ProductWidgetProps = {
  data: {
    id: string;
    metadata?: Record<string, any> | null;
  };
};

const ProductCustomFieldsWidget = ({ data: product }: ProductWidgetProps) => {
  const [fields, setFields] = useState<DynamicField[]>([
    { label: "", value: "" },
  ]);
  const queryClient = useQueryClient();

  // Sincronizza lo stato quando il prodotto cambia o viene ricaricato
  useEffect(() => {
    const savedAttributes = product.metadata?.custom_attributes as DynamicField[]

    if (Array.isArray(savedAttributes) && savedAttributes.length > 0) {
      setFields(savedAttributes)
    } else {
      // Se non ci sono attributi custom, resetta a un campo vuoto
      setFields([{ label: "", value: "" }])
    }
  }, [product.id, product.metadata]); // Dipendenze corrette per cambio pagina

  const { mutate: handleSave, isPending } = useMutation({
    mutationFn: async (metadata: Record<string, any>) => {
      return await sdk.admin.product.update(product.id, { metadata });
    },
    onSuccess: () => {
      toast.success("Campi aggiornati con successo");
      // Formato corretto della queryKey per invalidare il prodotto specifico
      queryClient.invalidateQueries({ queryKey: [["product", product.id]] });
    },
    onError: (error: any) => {
      toast.error(`Errore: ${error.message || "Impossibile salvare"}`);
    },
  });

  const addField = () => setFields([...fields, { label: "", value: "" }]);

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields.length > 0 ? newFields : [{ label: "", value: "" }]);
  };

  const updateField = (index: number, key: keyof DynamicField, val: string) => {
    const newFields = [...fields];
    newFields[index][key] = val;
    setFields(newFields);
  };

  const onSave = () => {
    // Filtra i campi validi (con label non vuota)
    const customAttributes = fields
      .filter(f => f.label.trim() !== "")
      .map(f => ({
        label: f.label.trim(),
        value: f.value
      }))

    // Mantieni i vecchi metadati e aggiorna solo custom_attributes
    const updatedMetadata = {
      ...product.metadata,
      custom_attributes: customAttributes
    }

    handleSave(updatedMetadata);
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Attributi Dinamici</Heading>
        <Button size="small" variant="secondary" onClick={addField}>
          Aggiungi Campo
        </Button>
      </div>

      <div className="flex flex-col gap-y-4 px-6 py-4">
        {fields.map((field, index) => (
          <div key={index} className="flex items-end gap-x-2 pb-2">
            <div className="grid flex-1 grid-cols-2 gap-x-2">
              <div className="space-y-2">
                <Label>Etichetta</Label>
                <Input
                  value={field.label}
                  onChange={(e) => updateField(index, "label", e.target.value)}
                  placeholder="es. Materiale"
                />
              </div>
              <div className="space-y-2">
                <Label>Valore</Label>
                <Input
                  value={field.value}
                  onChange={(e) => updateField(index, "value", e.target.value)}
                  placeholder="es. Cotone 100%"
                />
              </div>
            </div>
            {fields.length > 1 && (
              <Button
                variant="transparent"
                size="small"
                onClick={() => removeField(index)}
              >
                ×
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end px-6 py-4">
        <Button onClick={onSave} isLoading={isPending} variant="primary">
          Salva Campi
        </Button>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.side.after",
});

export default ProductCustomFieldsWidget;
