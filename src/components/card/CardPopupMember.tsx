import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';




export default function CardPopupMember() {
    const modalLabel = "member";

    return null
    
    return (
        <>
            <Dialog header="成員" modal={false} visible={false} 
                style={{ width: '50vw' }} onHide={() => {}}>
                <InputText  placeholder="搜尋成員"
                    className="
                        w-full
                        my-2
                        mr-10
                    "
                    />
            </Dialog>
        </>
    )
}

