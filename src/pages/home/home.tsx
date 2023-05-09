import Banner from './banner';
import PomodoroDescription from './pomodoroDescription';
import ProductDescription from './productDescription';
import RegisterZone from './registerZone';
import TeamUse from './teamUse';
import UserRecommend from './userRecommend';
import WorkApplication from './workApplication';

export default function home() {
  return <>
      <Banner></Banner>
      <ProductDescription></ProductDescription>
      <WorkApplication></WorkApplication>
      <PomodoroDescription></PomodoroDescription>
      <UserRecommend></UserRecommend>
      <TeamUse></TeamUse>
      <RegisterZone></RegisterZone>
  </>;
}
