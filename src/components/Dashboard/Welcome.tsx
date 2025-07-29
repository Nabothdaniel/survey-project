import { FiCalendar } from "react-icons/fi"
const Welcome = () => {
    return (
        <div className="mb-8">
            <div className="flex items-center text-sm text-gray-500 mb-2">
                <FiCalendar className="mr-2" /> MON, JUL 29, 2025
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Hi, Admin. Welcome back...
            </h1>
        </div>
    )
}

export default Welcome
