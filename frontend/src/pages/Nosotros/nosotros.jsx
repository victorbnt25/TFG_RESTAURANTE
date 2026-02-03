import fondoNosotros from "../../assets/media/camarero.webp";
import "./nosotros.css";


function Nosotros() {
return (
  <>
    <section className="nosotros">
  <div className="nosotros__inner">
    <div
      className="nosotros_foto"
      style={{ backgroundImage: `url(${fondoNosotros})` }}
    />

    <div className="nosotros__content">
      <h1 className="nosotros__title">
        <span className="white small"><strong>del</strong></span>
        <span className="primary big"><strong>BARRIO</strong></span>
        <span className="white small"><strong>a la</strong></span>
        <span className="primary big"><strong>PARRILLA</strong></span>
      </h1>
    </div>
  </div>
</section>

    <section>
      <div className="nosotros-historia">
        <h1>Nosotros</h1>
        <p>
          <strong>Nuestra historia no empieza en una cocina ni en un local, empieza en un aula.</strong>
          Nos conocimos en clase, estudiando informática. Víctor iba un poco perdido al principio,
          de esos días en los que miras el código y parece otro idioma. Rubén, en cambio, lo tenía
          bastante controlado, y lo mejor es que ayudaba sin pedir nada a cambio. Lo hacía porque sí,
          porque le salía natural. Ahí fue donde se forjó la amistad: entre apuntes, prácticas,
          cafés a contrarreloj y esa sensación de que, si vas con alguien al lado, todo pesa menos.
        </p>
    <br />
        <p>
          Con el tiempo llegó lo típico: exámenes, trabajos en grupo, presentaciones, entregas
          con fecha límite y noches en las que el ordenador parecía no apagarse nunca. Y, entre
          todo eso, apareció nuestro ritual. Antes de un examen importante o de preparar una
          presentación conjunta, siempre hacíamos lo mismo: salir a cenar hamburguesas.
          Era nuestra forma de desconectar y, al mismo tiempo, de cargar pilas.
        </p>
<br />
        <p>
          Empezamos probando las hamburgueserías más conocidas, pero rápido nos picó la curiosidad.
          Buscábamos las de barrio, las que no salen en todas partes, las que tienen cola porque el
          boca a boca funciona. Pedíamos distinto, compartíamos, debatíamos como si estuviéramos
          en una cata: el punto de la carne, la calidad del pan, la salsa, el crujiente, el equilibrio,
          si la burger se podía comer bien o si era puro postureo. Y sin darnos cuenta, nos aprendimos
          recetas, combinaciones y trucos casi de memoria.
        </p>
<br />
        <p>
          En una de esas cenas nos dimos cuenta de algo. Hablábamos más de hamburguesas que de
          informática. Y no era solo "está buena" o "está mala". Nos flipaba analizar por qué.
          Qué hacía que una burger fuese legendaria y qué hacía que otra se quedase a medias.
          Empezamos a decir frases como: "si en vez de esta salsa le metes otra, cambia todo",
          o "este pan aguanta perfecto, pero a esta le falta algo de contraste".
        </p>
<br />
        <p>
          Y ahí nació la idea de verdad. Primero como broma: "algún día montamos la nuestra".
          Luego como reto: "¿y si probamos a hacerla en casa?". Y así fue. Empezamos a experimentar:
          en casa, en quedadas, con amigos haciendo de jurado. Probábamos, fallábamos, ajustábamos.
          Cambiábamos el tipo de carne, el grosor, el sellado, las salsas, el toque final. Hubo burgers
          que salieron brutales y otras que no repetiremos ni aunque nos paguen. Pero ese era el punto:
          aprender a base de pruebas, y disfrutar el proceso.
        </p>
<br />
        <p>
          Poco a poco, la cosa dejó de ser un "plan" y empezó a sonar a "proyecto".
          Nos dimos cuenta de que no queríamos una hamburguesería más. Queríamos algo con identidad.
          Algo juvenil, de barrio, sin postureo y sin vender humo. Un sitio donde entras y sientes que
          estás en tu zona, donde la música, el ambiente y las burgers van con la misma energía.
        </p>
<br />
        <p>
          Ahí es donde nace <strong>Sons of Burger</strong>: de dos amigos que se conocieron estudiando,
          de un ritual antes de exámenes, y de la obsesión por hacer hamburguesas que tengan sentido.
          No queríamos copiar a nadie, queríamos construir nuestro propio estilo: burgers potentes,
          bien pensadas, con combinaciones que enganchen y que no se olviden a los cinco minutos.
        </p>
<br />
        <p>
          El nombre no es casual. "Sons" no va solo de "hijos" o de "banda", va de familia, de barrio,
          de crew. De esa gente que repite, que trae a otro colega, que ya te conoce y te dice:
          "ponme la de siempre". Y si algún día existe el local físico, lo imaginamos así:
          un sitio con personalidad, con detalles callejeros, con ambiente, y con una parrilla que
          no falla.
        </p>
<br />
        <p className="highlight">
          Lo más importante es que <strong>Sons of Burger</strong> nace con una idea clara:
          <strong> hacerlo auténtico</strong>. Sin ser una cadena, sin ser una moda pasajera.
          Una hamburguesería hecha para gente joven y para los que son de barrio de verdad.
          Porque cuando haces algo con ganas, se nota. Y cuando lo haces con alguien en quien confías,
          todavía más.
        </p>
<br />
        <p className="closing">
          Y así estamos: dos amigos que empezaron compartiendo apuntes y acabaron compartiendo una idea.
          Del barrio a la parrilla. Y de ahí, a lo que venga.
        </p>
      </div>
    </section>
  </>
);
}
export default Nosotros;