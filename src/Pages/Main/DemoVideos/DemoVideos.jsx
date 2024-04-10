import React, { useState } from "react";
import ComingSoon from "../../Shared/ComingSoon";

const DemoVideos = () => {
  const videos = [
    {
      id: 1,
      url: "https://www.youtube.com/embed/Lr2Xur5I-NU?si=OYjakOpoKOsBvU1u",
      title: "Most Beautiful Villages of Himachal Pradesh",
      thumbnailImg:
        "https://i.ytimg.com/vi/Lr2Xur5I-NU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLC-RzGEvYFkc6astllUSygH69ziDg",
    },
    {
      id: 2,
      url: "https://www.youtube.com/embed/ANgQYg4YRis?si=WknffGz50HwaCPmn",
      title: "Indian Village at 15000 ft ",
      thumbnailImg:
        "https://i.ytimg.com/vi/ANgQYg4YRis/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCzwd_hWG8V7D-R4WGtKeslhy-urg",
    },
    {
      id: 3,
      url: "https://www.youtube.com/embed/MnYBd-a8snw?si=cHrB8f78hRiHGtxO",
      title: "Most Beautiful Village Of India ~ KHONOMA",
      thumbnailImg:
        "https://i.ytimg.com/vi/MnYBd-a8snw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD-7kAHusILw8-yiOArQqaqf3CaiQ",
    },
    {
      id: 4,
      url: "https://www.youtube.com/embed/gyEcW2n5Rko?si=IfEB2UnN5dkm0oKB",
      title: "Last Village of India in Himachal Pradesh",
      thumbnailImg:
        "https://i.ytimg.com/vi/gyEcW2n5Rko/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCWI_t8cAFHwXbbamhXLRdhdAiPYw",
    },
    {
      id: 5,
      url: "https://www.youtube.com/embed/bqbsj3muUEY?si=JNnxOW6Lk9_jikxV",
      title: "Life of Monks at Remotest Place of India",
      thumbnailImg:
        "https://i.ytimg.com/vi/bqbsj3muUEY/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD7I5ji6iJiAXQ9m3i1ENNBhy6UEQ",
    },
  ];

  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <div className="text-center w-full h-full flex justify-center items-center overflow-hidden ">
      {/* <p className=" flex justify-center items-center gap-4 fancy-button w-full hover:scale-100">
        <MdVideoLibrary size={22} />
        <span>Demo videos</span>
        <MdVideoLibrary size={22} />
      </p>

      <div className="flex justify-around h-[calc(100%-14%)] w-full mt-4">
        <div className="w-[70%] h-full mr-3">
          <Player videoTitle={activeVideo?.title} videoUrl={activeVideo?.url} />
        </div>

        <div className="w-[30%] h-full overflow-hidden overflow-y-auto rounded-lg">
          {videos?.map((videoInfo) => (
            <AllDemoVideos
              key={videoInfo.id}
              videoInfo={videoInfo}
              setActiveVideo={setActiveVideo}
            />
          ))}
        </div>
      </div> */}
      {/* <p className="text-center text-black">Coming Soon....</p>
       */}
      <ComingSoon />
    </div>
  );
};

export default DemoVideos;
