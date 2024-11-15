# Desarrollo de un robot sumo

El campo de la robótica les permite a los estudiantes experimentar con el puente entre lo lógico y lo físico, y descubrir de forma didáctica, cómo se comporta.

Los robots sumo son **robots autónomos** cuyo objetivo es **empujar al oponente** fuera de un círculo, inspirados en el tradicional deporte japonés. El **control preciso del movimiento** de estos robots es de suma importancia para la efectividad de las tácticas, pero existen **numerosos factores** que pueden llegar a **perjudicarlo**, principalemente la **inercia**, **fricción** y la **calidad** del equipamiento.

## Simulación de control diferencial

Los estudiantes usaron **la herramienta en pantalla**, la cual permite **programar el movimiento** de un robot virtual, **simulando los factores** físicos nombrados previamente. Se usa un lenguaje de **programación por bloques**, similar a Scratch.

El robot utiliza el **control diferencial**, tiene **dos ruedas** conectadas a **dos motores** controladas de manera **individual**, más una rueda giratoria.

![Diagrama de sistema de motores diferenciales](/Tanklike.png)

- Cuando ambas ruedas tienen la **misma velocidad**, el robot avanza en **línea recta**.
- Cuando la **velocidad** de las ruedas **difiere**, el robot **vira**.

![Diagrama de sistema de motores diferenciales](/DifferentialSteering.svg)

### Fuentes
- Liga Nacional de Robótica Argentina
