import { Link } from 'react-router-dom';

const CategoryLinks = () => (
  <div className="w-1/5 hidden md:block p-4 border-r border-gray-200">
    <div className="space-y-2">
      <Link to="/category/feminine" className="block p-3 hover:bg-gray-100 border-b">Mode féminine <span className="float-right">›</span></Link>
      <Link to="/category/masculine" className="block p-3 hover:bg-gray-100 border-b">Mode masculine <span className="float-right">›</span></Link>
      <Link to="/category/electronics" className="block p-3 hover:bg-gray-100 border-b">Électronique</Link>
      <Link to="/category/home" className="block p-3 hover:bg-gray-100 border-b">Maison et lifestyle</Link>
      <Link to="/category/medicine" className="block p-3 hover:bg-gray-100 border-b">Médecine</Link>
      <Link to="/category/sports" className="block p-3 hover:bg-gray-100 border-b">Sports et plein air</Link>
      <Link to="/category/baby" className="block p-3 hover:bg-gray-100 border-b">Bébés et jouets</Link>
      <Link to="/category/grocery" className="block p-3 hover:bg-gray-100 border-b">Épicerie et animaux</Link>
      <Link to="/category/health" className="block p-3 hover:bg-gray-100 border-b">Santé et beauté</Link>
    </div>
  </div>
);

export default CategoryLinks;
