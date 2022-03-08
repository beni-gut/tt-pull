<template>
  <div class="general-information">
    <h1>One Raid</h1>
    <p>Displays a single raid with it's titans, an average damage per attack and the amount of clan members can be set for calculations.</p>

    <h1>Overview Raids</h1>
    <p>Displays all raids between a selected start and end raid, with it's titans, an average damage per attack and the amount of clan members can be set for calculations.</p>

    <h1>Raid details</h1>
    <h2 class="info-subtitle">Buff</h2>
    <p>Amount and Name of the Buff for this Raid</p>

    <h2 class="info-subtitle">Sequence</h2>
    <p>Sequence the titans will spawn in</p>

    <h2 class="info-subtitle">Number of titans</h2>
    <p>Total amount of titans in this raid</p>

    <h2 class="info-subtitle">Average damage</h2>
    <p>The average damage that was entered into the input</p>

    <h2 class="info-subtitle">Total damage needed to finish</h2>
    <p>The &quot;<i>Total damage needed to finish</i>&quot; is calculated by summing up all titans HP and the armour of each &quot;<i>Least damage needed strategy</i>&quot;</p>

    <h2 class="info-subtitle">Cycles needed</h2>
    <p>
      The &quot;<i>Cycles needed</i>&quot; is calculated by dividing the &quot;<i>Total damage</i>&quot; by the average damage
      times the number of members times the number of attacks per cycle
    </p>

    <h1>Titan details</h1>
    <h2 class="info-subtitle">Titan HP</h2>
    <p>Amount of HP needed to defeat the titan</p>

    <h2 class="info-subtitle">Debuff</h2>
    <p>Amount and Name of the Debuff for the specific titan</p>

    <h2 class="info-subtitle">Cursed parts</h2>
    <p>The cursed parts' names, &quot;<i>Left</i>&quot; meaning the part on the left side of the screen, &quot;<i>Right</i>&quot; the one on the right side.</p>

    <h2 class="info-subtitle">Curse</h2>
    <p>The number of cursed parts, the amount of the debuff and the type of the curse</p>

    <h2 class="info-subtitle">Least damage needed strategy</h2>
    <p id="before-strategies-explanation">
      There's a number of different strategies at the moment. They are calculated by taking the least amount of armour needed to destroy, to kill the titan. <br />
      If the titan has no armour, such as in Tier 1 raids, it will default to &quot;<i>All Parts</i>&quot;<br />
      The different strategies are as follows:
    </p>
    <ul class="different-strategies-explanation-list">
      <li class="strategies-list-element">
        <b>8-part IV</b>
        <ul class="different-strategies-explanation-list">
          <li>AllParts &ndash; <i>All Parts need to be destroyed to defeat the titan</i></li>
        </ul>
      </li>
      <li class="strategies-list-element">
        <b>7-part IV</b>
        <ul class="different-strategies-explanation-list">
          <li>NoHead &ndash; <i>Head not needed to defeat the titan</i></li>
          <li>NoTorso &ndash; <i>Torso not needed to defeat the titan</i></li>
        </ul>
      </li>
      <li class="strategies-list-element">
        <b>6-part IV</b>
        <ul class="different-strategies-explanation-list">
          <li>NoTorsoNoHead &ndash; <i>neither Head nor Torso needed to defeat the titan</i></li>
          <li>NoLegs &ndash; <i>Legs not needed to defeat the titan</i></li>
        </ul>
      </li>
      <li class="strategies-list-element">
        <b>5-part IV</b>
        <ul class="different-strategies-explanation-list">
          <li>NoLegsNoHead &ndash; <i>neither Head nor Legs needed to defeat the titan</i></li>
          <li>NoLegsNoTorso &ndash; <i>neither Torso nor Legs needed to defeat the titan</i></li>
        </ul>
      </li>
    </ul>

    <h2 class="info-subtitle">Total damage needed</h2>
    <p>Sum of total HP and the armour of all parts that are not excluded in the &quot;<i>Least damage needed strategy</i>&quot;</p>
  </div>
</template>

<script>
export default {
  name: 'InfoPage'
}
</script>

<style>
@media (min-width: 1200px) {
  .general-information {
    margin-left: 25%;
    margin-right: 25%;
    max-width: 50%;
  }
}
@media (max-width: 1199px) {
  .general-information {
    margin-left: 15%;
    margin-right: 15%;
    max-width: 70%;
  }
}
@media (max-width: 991px) {
  .general-information {
    margin-left: 5%;
    margin-right: 5%;
    max-width: 90%;
  }
}
@media (max-width: 575px) {
  .general-information {
    width: 100%;
  }
}

/* Style of the list */
.different-strategies-explanation-list {
  margin-top: 0;
  padding: 0;
  list-style: none;
}
.strategies-list-element {
  padding-top: .5rem;
}
#before-strategies-explanation {
  margin-bottom: 0;
}
.info-subtitle {
  font-size: 1.2em;
  margin-bottom: 0;
}
.info-subtitle + p {
  margin-top: 0;
}

</style>