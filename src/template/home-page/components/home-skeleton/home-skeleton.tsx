function HomeSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-8">
      <div className="space-y-2">
        <div className="h-7.5 w-1/2 bg-gray-300 rounded-xl" />
        <div className="h-5 w-2/3 bg-gray-300 rounded-xl" />
      </div>
      <div className="grid grid-cols-4 gap-3">
        <div className="h-25 bg-gray-300 rounded-xl flex-1" />
        <div className="h-25 bg-gray-300 rounded-xl flex-1" />
        <div className="h-25 bg-gray-300 rounded-xl flex-1" />
        <div className="h-25 bg-gray-300 rounded-xl flex-1" />
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col gap-2 col-span-2">
          <div className="h-5 w-50 bg-gray-300 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-60 bg-gray-300 rounded-xl" />
            <div className="h-60 bg-gray-300 rounded-xl" />
            <div className="h-60 bg-gray-300 rounded-xl" />
            <div className="h-60 bg-gray-300 rounded-xl" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-5 w-50 bg-gray-300 rounded-xl" />
          <div className="h-full w-full bg-gray-300 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export { HomeSkeleton };
