# Anytype - Data structure description language

UniversalExtendedCard.at

```
import "../helpers"

defined UniversalExtendedCardWidgetData (This is widgets data!) is object (
    option line - array [0..1000] of object (
        required yCoordFrom - see "integer"
    ),
    required cell (
        This is comment.
        Это русский комментарий...
        And this text (with brackets) and more.
    ) - array [0..1000] of object (
        required nXCoord - integer,
        required nYCoord - integer,
        required object - array of one of (
            object (
                with Measure,
                with Actions,
                required sObjectType - value "deviation",
                required sName - string,
                required fValue - float,
                option nPrecision - integer,
                option isGood - Boolean,
                option arrow - single object (
                    required nDirection - integer,
                    option isGood - Tristate
                )
            )
        )
    )
)

```