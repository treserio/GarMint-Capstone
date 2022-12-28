import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore"
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore"


type EagerSimpleOne = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SimpleOne, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly postGres?: string | null;
  readonly SomethingElse?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazySimpleOne = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<SimpleOne, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly postGres?: string | null;
  readonly SomethingElse?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type SimpleOne = LazyLoading extends LazyLoadingDisabled ? EagerSimpleOne : LazySimpleOne

export declare const SimpleOne: (new (init: ModelInit<SimpleOne>) => SimpleOne) & {
  copyOf(source: SimpleOne, mutator: (draft: MutableModel<SimpleOne>) => MutableModel<SimpleOne> | void): SimpleOne;
}
