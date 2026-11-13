import { ThemeToggle, Button, Input, Card, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../src/components/ui';
import { AuthLoadingScreen } from '../../src/components/shared/AuthLoadingScreen';

// Test-only screen composed of production primitives; never a production route.
export function ThemeStates() {
  return <main className="min-h-screen bg-surface p-8 text-on-surface space-y-6">
    <ThemeToggle />
    <Card className="p-6 space-y-4 max-w-lg">
      <h1>Estados de controles</h1>
      <Input label="Correo" error="Ingresá un correo válido" defaultValue="incorrecto" />
      <Input label="Nombre" helperText="Usá tu nombre completo" placeholder="Nombre y apellido" />
      <Input label="Deshabilitado" disabled value="Solo lectura" />
      <Button disabled>Guardar</Button><Button loading aria-label="Guardando" />
      <p className="text-on-surface-variant">No hay resultados.</p>
      <Accordion type="single" collapsible>
        <AccordionItem value="one"><AccordionTrigger>Más información</AccordionTrigger><AccordionContent>Contenido de ayuda.</AccordionContent></AccordionItem>
      </Accordion>
      <Dialog><DialogTrigger asChild><Button>Abrir diálogo</Button></DialogTrigger>
        <DialogContent aria-describedby={undefined}><DialogTitle>Confirmación</DialogTitle><p className="text-on-surface-variant">Revisá los datos antes de continuar.</p><DialogClose asChild><Button>Cerrar</Button></DialogClose></DialogContent>
      </Dialog>
    </Card>
    <AuthLoadingScreen />
  </main>;
}
