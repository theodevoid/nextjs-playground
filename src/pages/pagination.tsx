import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { wilayahNusantaraAxios } from "~/lib/axios";

type PaginableResponse<T> = {
  data: T[];
  meta: {
    limit: number;
    page: number;
    total: number;
  };
};

type Regency = {
  code: string;
  regency: string;
};

export default function PaginationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const LIMIT_PER_PAGE = 10;

  const [totalData, setTotalData] = useState<number>(0);
  const totalPages = Math.ceil(totalData / LIMIT_PER_PAGE);

  const [regencies, setRegencies] = useState<Regency[]>([]);

  const fetchRegencies = async () => {
    const { data } = await wilayahNusantaraAxios.get<
      PaginableResponse<Regency>
    >("/kabupaten", {
      params: {
        page: currentPage,
      },
    });

    setRegencies(data.data);
    setTotalData(data.meta.total);
  };

  const handleChangePage = (newPage: number) => {
    router.push({
      href: router.asPath,
      query: {
        page: newPage,
      },
    });
  };

  useEffect(() => {
    if (router.isReady) {
      fetchRegencies();
    }
  }, [currentPage, router.isReady]);

  return (
    <>
      <Head>
        <title>Pagination</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="mb-10 border-b-2 p-4 text-center text-[2rem] font-semibold">
        Handling pagination
      </header>
      <main className="flex flex-col items-center justify-center gap-8">
        <p className="text-center text-xl font-semibold">
          Current page: {currentPage}
        </p>
        <ul className="list-disc">
          {regencies.map(({ code, regency }) => {
            return <li key={code}>{regency}</li>;
          })}
        </ul>

        <div className="flex flex-wrap gap-4">
          {currentPage > 1 && (
            <Button
              onClick={() => {
                handleChangePage(currentPage - 1);
              }}
            >
              Prev page
            </Button>
          )}
          {new Array(totalPages).fill(1).map((val, index) => {
            return (
              <Button
                onClick={() => {
                  handleChangePage(index + 1);
                }}
                variant={index + 1 == currentPage ? "secondary" : "outline"}
                disabled={index + 1 == currentPage}
                key={index}
              >
                {index + 1}
              </Button>
            );
          })}
          {currentPage < totalPages && (
            <Button
              onClick={() => {
                handleChangePage(currentPage + 1);
              }}
            >
              Next page
            </Button>
          )}
        </div>
      </main>
    </>
  );
}
