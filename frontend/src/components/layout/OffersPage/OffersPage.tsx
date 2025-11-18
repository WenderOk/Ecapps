import { useState, useEffect } from "react";
import Card from "../../ui/Card/Card.tsx";
import { apiService, type Business } from "../../services/api";

const OffersPage = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBusinesses();
  }, []);

  const loadBusinesses = async () => {
    try {
      const businessesData = await apiService.getBusinesses();
      setBusinesses(businessesData);
    } catch (error) {
      console.error("Error loading businesses:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Загрузка предложений...</div>;
  }

  return (
    <>
      {businesses.map(business => (
        <Card 
          key={business.id}
          title={business.company_name}
          address={business.address}
          image="https://via.placeholder.com/300x200" // Заглушка
        />
      ))}
    </>
  );
};

export default OffersPage;