import { MenuBar, List, AddListButton } from '@/components/board'
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

      <div className="grid gap-4 px-4 h-full overflow-scroll">
        {listDataList.map((item, i) => (
          <List key={i} title={item.title} />
        ))}

        <AddListButton />
      </div>
    </>
  )
}
