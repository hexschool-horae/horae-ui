import { Button } from 'primereact/button';

interface ICardSidebarButtonProps {
    name: string,
    label: string,
}

export default function CardSidebarButton({ name, label }: ICardSidebarButtonProps) {
  return (
    <Button label={name}  icon="pi pi-user" className="w-full"
        onClick={() => {}}
    />
  )
}
