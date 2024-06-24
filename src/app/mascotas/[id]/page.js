import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function MascotaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [pet, setPet] = useState(null);

  useEffect(() => {
    if (status === "loading") return; 
    if (!session) router.push("/login"); 
  }, [session, status, router]);

  useEffect(() => {
    if (id) {
      axios.get(`/api/mascota/${id}`).then((response) => {
        setPet(response.data);
      });
    }
  }, [id]);

  if (status === "loading" || !pet) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{pet.name}</h1>
      <p>Raza: {pet.fk_race.name}</p>
      <p>Categoría: {pet.fk_category.name}</p>
      <p>Género: {pet.fk_gender.name}</p>
    </div>
  );
}
