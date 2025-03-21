<template>
  <div class="charactercontainer">
    <header>
      <h1 class="title">Gestion des personnages</h1>
      <NuxtLink to="/characters/create"><Button variant="create" >Créer un personnage</Button></NuxtLink>
      <p>Voici la liste de tes personnages de jeu de rôle :</p>
    </header>

    <div class="datacontainer">
      <table>
        <tr v-for="character in characters" :key="character.id">
          <td><img :src= "character.race.image" alt=""></td>
          <td>{{ character.name }} <br> Niveau {{ character.level }}</td>
          <td><Button variant="select" @click="selectCharacter(character)">Sélectionner</Button></td>
          <td><Button variant="delete" @click="deleteCharacter(character.id)">Supprimer</Button></td>
        </tr>
      </table>
    </div>
    <p v-if="characterStore.selectedCharacter">Personnage actuellement sélectionné pour la campagne:  {{ characterStore.selectedCharacter.name }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useCharacterStore } from '@/stores/character'
import Button from '@/components/Button.vue';
import { useNuxtApp } from '#app';

const nuxtApp = useNuxtApp();
const db = computed(() => nuxtApp.$firebaseDb);

const characters = ref([]);
const characterStore = useCharacterStore();
const charactersCollection = computed(() => db.value ? collection(db.value, "characters") : null);
let unsubscribeListener = null;

//Écoute en temps réel avec `onSnapshot()`
const listenToCharacters = () => {
  if (!charactersCollection.value) return;

  unsubscribeListener = onSnapshot(charactersCollection.value, (snapshot) => {
    characters.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
};

const deleteCharacter = async (id) => {
  if (!db.value) return;
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`avatar_${id}`);
  }
  await deleteDoc(doc(db.value, "characters", id));
};

const selectCharacter = (character) => {
  try {
    if (typeof window !== 'undefined') {
      const savedAvatar = localStorage.getItem(`avatar_${character.id}`);
      if (savedAvatar) {
        character = { ...character, avatar: savedAvatar };
      }
    }

    characterStore.setCharacter(character);
  } catch (error) {
    console.error("Erreur lors de la sélection du personnage:", error);
    characterStore.setCharacter(character);
  }
};

watch(() => characterStore.selectedCharacter, (newCharacter) => {
  if (newCharacter && typeof window !== 'undefined') {
    const savedAvatar = localStorage.getItem(`avatar_${newCharacter.id}`);
    if (savedAvatar && (!newCharacter.avatar || newCharacter.avatar.startsWith('/icons/'))) {
      const updatedCharacter = { ...newCharacter, avatar: savedAvatar };
      characterStore.setCharacter(updatedCharacter);
    }
  }
});

onMounted(() => {
  listenToCharacters();
});

onUnmounted(() => {
  if (unsubscribeListener) {
    unsubscribeListener(); // Arrête l'écoute pour éviter les fuites mémoire
  }
});
</script>

<style scoped>
header {
  display: flex;
  flex-direction: column;
}
.title{
  margin-bottom: 10%;
  text-align: center;
}
.create{
  margin-bottom: 10%;
}
table {
  margin: 10% 0;
  background: rgba(245, 245, 245, 0.24);
  color: white;
}
.charactercontainer {
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  top: 20px;

}

tr{
  display: flex;
}
td {
  border : 1px black solid;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 5px;
  width: 120px;
 img {
  width: 80px;
 }
}

a {
  display: flex;
  justify-content: center;
  text-decoration: none;
}

p {
  color:white;
  background: none;
}

@media screen and (min-width: 1024px) {
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .charactercontainer {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    bottom: 30px;

  }

  td {
    min-width: 150px;
    padding: 10px;
  }
  .datacontainer {
    display: flex;
    justify-content : center;
    position: relative;
    bottom: 10%
  }
  .title{
    margin-bottom: 100px;
    color: white;
  }

  .create{
    margin-bottom: 100px;
  }
}

@media screen  and (min-width:375px) {
  p {
    color :white;
    width: fit-content;
  }
}
</style>