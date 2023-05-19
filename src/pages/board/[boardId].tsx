import { MenuBar, CardList, AddCardListButton } from '@/components/board'
import Head from 'next/head'

export default function Board() {
  const listDataList = [{ title: '家居' }, { title: '教學' }, { title: '學習' }, { title: '文章' }]
  return (
    <>
      <Head>
        <title>Horae - 看板</title>
      </Head>

      <div className="mb-6">
        <MenuBar />
      </div>

      <div className="grid gap-4 px-4 h-full">
        {listDataList.map((item, i) => (
          <CardList key={i} title={item.title} />
        ))}

        <AddCardListButton />
      </div>

      {/* <Button
        className="p-0"
        label="前往個人頁面"
        onClick={() => router.push("/profile")}
        link
      /> */}
    </>
  )
}
