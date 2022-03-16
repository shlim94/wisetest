package com.wise.common.util;

import java.io.Serializable;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class UniqueIdentifierGenerator {
    private final String hostName;
    private final long creationTimeMillis;
    private long lastTimeMillis;
    private long discriminator;

    public UniqueIdentifierGenerator() throws UnknownHostException {
        this.hostName = InetAddress.getLocalHost().getHostAddress();
        this.creationTimeMillis = System.currentTimeMillis();
        this.lastTimeMillis = creationTimeMillis;
    }

    public synchronized Serializable createId() {
        String id;
        long now = System.currentTimeMillis();

        if (now == lastTimeMillis) {
            ++discriminator;
        } else {
            discriminator = 0;
        }

        // creationTimeMillis used to prevent multiple instances of the JVM
        // running on the same host returning clashing IDs.
        // The only way a clash could occur is if the applications started at
        // exactly the same time.
        id = String.format("%s-%d-%d-%d", hostName, creationTimeMillis, now, discriminator);
        lastTimeMillis = now;

        return id;
    }

    public static void main(String[] args) throws UnknownHostException {
        UniqueIdentifierGenerator fact = new UniqueIdentifierGenerator();

//        for (int i = 0; i < 1000; ++i) {
//            System.out.println(fact.createId());
//        }

        System.out.println("192.168.236.1-1437618267051-1437618267207-34".hashCode());
        System.out.println("192.168.236.1-1437618267051-1437618267207-35".hashCode());
        System.out.println("192.168.236.1-1437618267051-1437618267207-36".hashCode());
        System.out.println("192.168.236.1-1437618267051-1437618267207-37".hashCode());
    }
}
