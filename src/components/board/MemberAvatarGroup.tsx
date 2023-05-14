import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";

export default function MemberAvatarGroup() {
  return (
    <AvatarGroup className="ml-auto mr-4">
      <Avatar image="/images/avatar/amyelsner.png" size="normal" shape="circle" />
      <Avatar label="+2" shape="circle" size="normal" style={{ backgroundColor: "#FF6848", color: "#ffffff" }} />
    </AvatarGroup>
  );
}
