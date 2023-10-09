function Customization() {
  return (
    <div className="py-5 px-2">
      {/* Position UI */}
      <div>
        <div className="tracking-tight mb-2">Position</div>
        <div className="flex h-[130px] gap-2 hover:cursor-pointer">
          <div className="w-[50%] bg-custom-gray rounded-lg p-2">
            <div className="w-[20px] h-[20px] bg-gray-400 rounded-md"></div>
          </div>
          <div className="w-[50%] bg-custom-gray rounded-lg p-2 flex justify-end">
            <div className="w-[20px] h-[20px] bg-gray-400 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Color Scheme UI */}
      <div>
        <div className="tracking-tight leading-none mb-2 mt-6">Color Scheme</div>
        <div className="flex gap-2 hover:cursor-pointer">
          <div className="bg-custom-gray px-3 py-2 rounded-lg tracking-tight font-medium">Light Mode</div>
          <div className="bg-custom-gray active px-3 py-2 rounded-lg tracking-tight font-medium">Dark Mode</div>
          <div className="bg-custom-gray px-3 py-2 rounded-lg tracking-tight font-medium">System</div>
        </div>
      </div>
    </div>
  );
}

export default Customization;
