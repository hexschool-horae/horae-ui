import { useContext } from "react";
import { UserContext } from "@/contexts/userContext";

const useUserState = () => useContext(UserContext);

export default useUserState;
