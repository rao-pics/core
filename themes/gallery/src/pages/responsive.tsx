import { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/legacy/image";
import { useWindowSize } from "@react-hook/window-size";
import justifyLayout from "justified-layout";
import {
  MasonryScroller,
  useContainerPosition,
  useInfiniteLoader,
  usePositioner,
} from "masonic";

import type { EXT } from "@rao-pics/constant";
import { numberToHex } from "@rao-pics/utils";

import { trpc } from "~/utils/trpc";

type JustifyLayoutResult = ReturnType<typeof justifyLayout>;

function Home() {
  const limit = 50;
  const containerRef = useRef(null);
  const [windowWidth, windowHeight] = useWindowSize();
  const { offset, width } = useContainerPosition(containerRef, [
    windowWidth,
    windowHeight,
  ]);

  const { data: config } = trpc.config.findUnique.useQuery();

  const imageQuery = trpc.image.find.useInfiniteQuery(
    { limit, includes: ["colors"] },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const pages = imageQuery.data?.pages;

  const images = useMemo(() => {
    const result = pages?.map((page) => {
      return page.data.map((image) => {
        const id = image.path.split(/\/|\\/).slice(-2)[0];
        const host = `http://${config?.ip}:${config?.serverPort}`;
        const src = `${host}/static/${id}/${image.name}.${image.ext}`;
        const thumbnailPath = image.noThumbnail
          ? src
          : `${host}/static/${id}/${image.name}_thumbnail.png`;

        return {
          id: image.id,
          src,
          thumbnailPath,
          bgColor: numberToHex(image.colors?.[0]?.rgb ?? 0),
          width: image.width,
          height: image.height,
          ext: image.ext as unknown as typeof EXT,
        };
      });
    });

    return result?.flat();
  }, [config?.ip, config?.serverPort, pages]);

  const items = useMemo(() => {
    if (images && width) {
      const results: JustifyLayoutResult[] = [];
      const imageTemp = JSON.parse(JSON.stringify(images)) as typeof images;
      const imageResult: (typeof images)[] = [];

      while (imageTemp.length > 0) {
        const result = justifyLayout(imageTemp, {
          maxNumRows: 1,
          containerWidth: width,
          containerPadding: 0,
          boxSpacing: 12,
          targetRowHeight: 300,
        });

        imageResult.push(imageTemp.splice(0, result.boxes.length));
        results.push(result);
      }

      return {
        justify: results,
        images: imageResult,
      };
    }

    return null;
  }, [images, width]);

  const positioner = usePositioner({
    width: width,
    columnGutter: windowWidth < 768 ? 8 : 12,
    columnCount: 1,
  });

  const onLoadMore = useInfiniteLoader(
    async () => {
      if (imageQuery.hasNextPage) {
        await imageQuery.fetchNextPage();
      }
    },
    {
      minimumBatchSize: limit,
      threshold: 3,
    },
  );

  return (
    <main className="p-2 md:p-3">
      <MasonryScroller
        onRender={onLoadMore}
        positioner={positioner}
        offset={offset}
        height={windowHeight}
        containerRef={containerRef}
        items={items?.justify ?? []}
        render={({ data, index }) => {
          const itemImages = items?.images[index];
          return (
            <div
              style={{
                height: data.containerHeight + "px",
                position: "relative",
              }}
            >
              {data.boxes.map((box, i) => {
                const image = itemImages?.[i];

                return (
                  image && (
                    <div
                      key={image.id}
                      className="relative overflow-hidden rounded"
                      style={{
                        width: `${box.width}px`,
                        height: `${box.height}px`,
                        position: "absolute",
                        top: `${box.top}px`,
                        left: `${box.left}px`,
                        backgroundColor: image.bgColor + "7F",
                      }}
                    >
                      <Image src={image.thumbnailPath} layout="fill" />
                    </div>
                  )
                );
              })}
            </div>
          );
        }}
      />
    </main>
  );
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });