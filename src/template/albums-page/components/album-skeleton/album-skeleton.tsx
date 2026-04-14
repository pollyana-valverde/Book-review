function AlbumSkeleton() {
  return (
    <div className="animate-pulse flex flex-col gap-8">
      <div className="flex justify-between items-end">
        <div className="space-y-2 w-full">
          <div className="h-7.5 w-1/2 bg-gray-300 rounded-xl" />
          <div className="h-5 w-2/3 bg-gray-300 rounded-xl" />
        </div>
        <div className="h-10 w-45 bg-gray-300 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="h-40 bg-gray-300 rounded-xl" />
        <div className="h-40 bg-gray-300 rounded-xl" />
        <div className="h-40 bg-gray-300 rounded-xl" />
        <div className="h-40 bg-gray-300 rounded-xl" />
        <div className="h-40 bg-gray-300 rounded-xl" />
        <div className="h-40 bg-gray-300 rounded-xl" />
      </div>
    </div>
  );
}

export { AlbumSkeleton };
