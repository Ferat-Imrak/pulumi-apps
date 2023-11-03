import * as pulumi from "@pulumi/pulumi";
import * as eks from "@pulumi/eks";
import * as awsx from "@pulumi/awsx";

// Create an EKS cluster with the given name.
const cluster = new eks.Cluster("nginx-cluster-tst", {
    vpcId: "vpc-00b32f2db0551503c",
    subnetIds: ["subnet-0524dbaaf3e967ce9", "subnet-05669be62b98b0d42", "subnet-071c9ff70cf1a7011", "subnet-0d8d845ec46ae7354"],
    desiredCapacity: 2,
    minSize: 1,
    maxSize: 2,
    storageClasses: "gp2",
    deployDashboard: false,
});

// Create a NodeGroup attached to the EKS cluster.
const nodeGroup = new eks.NodeGroup("node-group-nginx", {
    cluster: cluster,
    desiredCapacity: 2,
    instanceType: "t2.medium",
    minSize: 1,
    maxSize: 2,
    labels: { env: "dev" },
}, { 
    providers: { kubernetes: cluster.provider },
});

// Export the kubeconfig of the EKS cluster.
export const kubeconfig = cluster.kubeconfig;