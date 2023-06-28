import Head from 'next/head'
import Banner from './banner'
import PomodoroDescription from './pomodoroDescription'
import ProductDescription from './productDescription'
import RegisterZone from './registerZone'
import TeamUse from './teamUse'
import UserRecommend from './userRecommend'
import WorkApplication from './workApplication'

export default function home() {
  return (
    <>
      <Head>
        <title>Horae - 首頁</title>
      </Head>
      <Banner></Banner>
      <ProductDescription></ProductDescription>
      <WorkApplication></WorkApplication>
      <PomodoroDescription></PomodoroDescription>
      <UserRecommend></UserRecommend>
      <TeamUse></TeamUse>
      <RegisterZone></RegisterZone>
    </>
  )
}
