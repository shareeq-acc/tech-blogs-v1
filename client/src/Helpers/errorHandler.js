import { useDispatch } from "react-redux"

export const useHandleError = (response) => {
    const dispatch = useDispatch()
    try {
        if (response?.response) {
            
        }
    } catch (error) {

    }
}

export default useHandleError