import { useCustomInitialState } from '@/helper/hook';
import FavouriteForm from './components/FavouriteForm';

const MyFavorite = () => {
  const { currentUser } = useCustomInitialState();
  return <div>{currentUser?.retrieve_favourite === true ? '' : <FavouriteForm />}</div>;
};
export default MyFavorite;
