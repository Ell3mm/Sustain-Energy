public class GreenCalculator {
    // Levels: 0 = not started, 1 = basic, 2 = solid, 3 = leading
    private static int levelToPoints(int level) {
        if (level < 0) {
            return 0;
        }
        if (level > 3) {
            level = 3;
        }
        return level * 5;
    }

    public static int score(
            int energy,
            int renewables,
            int waste,
            int water,
            int transport,
            int procurement,
            int engagement,
            int community
    ) {
        return levelToPoints(energy)
                + levelToPoints(renewables)
                + levelToPoints(waste)
                + levelToPoints(water)
                + levelToPoints(transport)
                + levelToPoints(procurement)
                + levelToPoints(engagement)
                + levelToPoints(community);
    }

    public static void main(String[] args) {
        int total = score(3, 2, 2, 1, 1, 2, 3, 2);
        System.out.println("Sample total points: " + total);
    }
}
