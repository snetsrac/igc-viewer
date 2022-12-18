export default function Header() {
  return (
    <header>
      <nav className='bg-gray-800 px-2 text-white sm:px-4 lg:px-8'>
        <div className='flex h-20 items-center justify-between'>
          <div className='flex items-center gap-8'>
            <span className='text-3xl font-bold tracking-wider'>IGC Viewer</span>
          </div>
        </div>
      </nav>
    </header>
  );
}
