const Footer = () => {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} <span className="font-medium text-gray-700">Survey Project</span>. 
          All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
