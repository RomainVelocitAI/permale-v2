// Textes poétiques pour la présentation des bijoux
// Chaque type de bijou a 4 textes pour les 4 slides de présentation

export interface PresentationTexts {
  slide1: string; // Image présentation 1 - Photo couchée du bijou
  slide2: string; // Image présentation 2 - Bijou porté
  slide3: string; // Image présentation 3 - Bijou dans son écrin
  slide4: string; // Image présentation 4 - Bijou sur support
}

export const presentationTexts: Record<string, PresentationTexts> = {
  // BAGUES (Alliance, Bague de Fiançailles, Chevalière, Bague autre)
  'Alliance': {
    slide1: "Deux âmes qui s'entrelacent dans l'or éternel, un cercle sans fin où l'amour trouve son sanctuaire.",
    slide2: "Sur votre main, elle raconte déjà votre histoire. Chaque reflet capture un moment de bonheur partagé.",
    slide3: "Dans son écrin de velours, votre promesse attend son moment. Le début d'une histoire qui durera toujours.",
    slide4: "Notre promesse : créer le symbole éternel qui témoignera de votre amour à travers les générations."
  },
  
  'Bague de Fiançailles': {
    slide1: "Une promesse scintillante, capturant la lumière comme votre cœur capture l'amour.",
    slide2: "À votre doigt, elle devient le témoin lumineux d'un engagement unique et précieux.",
    slide3: "Nichée dans son écrin, elle attend le moment magique où le 'oui' illuminera deux vies.",
    slide4: "Notre promesse : sublimer le moment le plus important de votre vie avec un bijou d'exception."
  },
  
  'Chevalière': {
    slide1: "Noble et intemporelle, elle porte en elle l'héritage et la force de votre lignée.",
    slide2: "Ornant votre main avec prestance, elle affirme votre caractère et votre distinction.",
    slide3: "Dans son écrin capitonné, un symbole de tradition attend de perpétuer votre histoire.",
    slide4: "Notre promesse : perpétuer votre héritage avec un bijou qui traversera les siècles."
  },
  
  'Bague autre': {
    slide1: "Une création unique qui transcende les conventions, façonnée pour raconter votre histoire.",
    slide2: "À votre doigt, elle devient l'extension de votre personnalité, unique et remarquable.",
    slide3: "Protégée dans son écrin, une œuvre d'art personnelle attend de révéler sa splendeur.",
    slide4: "Notre promesse : donner vie à vos rêves les plus précieux dans un bijou unique."
  },
  
  // COLLIERS ET PENDENTIFS
  'Collier': {
    slide1: "Une cascade de lumière façonnée avec une précision infinie, où chaque maillon raconte une histoire d'excellence.",
    slide2: "Contre votre peau, il épouse vos courbes et illumine votre beauté naturelle.",
    slide3: "Précieusement gardé dans son écrin, ce joyau attend de révéler sa splendeur lors des moments d'exception.",
    slide4: "Chaque création PERMALE est une promesse : celle de vous accompagner dans les instants qui comptent vraiment."
  },
  
  'Pendentif': {
    slide1: "Une goutte de lumière suspendue dans le temps, portant en elle un message secret.",
    slide2: "Près de votre cœur, il bat au rythme de vos émotions et garde vos souvenirs précieux.",
    slide3: "Dans son écrin douillet, un talisman personnel attend de devenir votre compagnon quotidien.",
    slide4: "Notre promesse : créer le talisman qui portera vos secrets et vos espoirs."
  },
  
  // BOUCLES D'OREILLES
  "Boucle d'oreille": {
    slide1: "Deux étoiles jumelles prêtes à danser au gré de vos mouvements et illuminer votre visage.",
    slide2: "Encadrant votre visage avec grâce, elles captent la lumière à chaque sourire.",
    slide3: "Dans leur écrin, deux complices attendent de sublimer votre beauté naturelle.",
    slide4: "Notre promesse : illuminer chaque instant de votre vie avec l'éclat de l'excellence."
  },
  
  // BRACELET
  'Bracelet': {
    slide1: "Un cercle de lumière qui enlacera votre poignet, témoin silencieux de vos gestes quotidiens.",
    slide2: "À votre poignet, il danse et scintille, accompagnant chacun de vos mouvements avec élégance.",
    slide3: "Dans l'intimité de son écrin, ce bijou d'exception préserve sa beauté pour les regards privilégiés.",
    slide4: "Notre promesse : créer le bijou qui transcendera les époques et traversera les générations."
  },
  
  // PIERCING
  'Percing': {
    slide1: "Un éclat de personnalité, minimaliste et audacieux, conçu pour sublimer votre singularité.",
    slide2: "Sur vous, il devient une signature, un détail qui fait toute la différence.",
    slide3: "Dans son écrin moderne, un bijou d'exception attend de révéler votre côté rebelle et raffiné.",
    slide4: "Notre promesse : exprimer votre singularité dans chaque détail de cette création."
  },
  
  // BIJOUX AUTRE
  'Bijoux autre': {
    slide1: "Une création hors du commun, née de l'imagination et façonnée par la passion.",
    slide2: "Porté avec fierté, ce bijou unique raconte une histoire que vous seul connaissez.",
    slide3: "Dans son écrin sur mesure, une œuvre d'art personnelle attend son moment de gloire.",
    slide4: "Notre promesse : transformer votre vision en une œuvre d'art intemporelle."
  },
  
  // Version par défaut pour la catégorie "Bague" dans Airtable
  'Bague': {
    slide1: "Un anneau précieux où se cristallise l'essence même de vos désirs et de vos rêves.",
    slide2: "À votre doigt, elle devient le reflet lumineux de votre personnalité unique.",
    slide3: "Dans son écrin capitonné, un trésor attend de prendre vie à votre main.",
    slide4: "Notre promesse : faire de votre bijou le témoin privilégié de votre histoire."
  },
  
  // Version par défaut pour la catégorie "Boucles d'oreilles" dans Airtable
  "Boucles d'oreilles": {
    slide1: "Deux étoiles jumelles prêtes à danser au gré de vos mouvements et illuminer votre visage.",
    slide2: "Encadrant votre visage avec grâce, elles captent la lumière à chaque sourire.",
    slide3: "Dans leur écrin, deux complices attendent de sublimer votre beauté naturelle.",
    slide4: "Notre promesse : illuminer chaque instant de votre vie avec l'éclat de l'excellence."
  },
  
  // Version par défaut pour la catégorie "Autre" dans Airtable
  'Autre': {
    slide1: "Une création unique qui transcende les conventions, façonnée pour raconter votre histoire.",
    slide2: "Porté avec fierté, ce bijou unique raconte une histoire que vous seul connaissez.",
    slide3: "Dans son écrin sur mesure, une œuvre d'art personnelle attend son moment de gloire.",
    slide4: "Notre promesse : transformer votre vision en une œuvre d'art intemporelle."
  }
};

// Fonction helper pour obtenir les textes selon le type de bijou
export function getTextsForJewelryType(typeBijou: string): PresentationTexts {
  // Retourner les textes spécifiques ou les textes par défaut
  return presentationTexts[typeBijou] || presentationTexts['Autre'];
}